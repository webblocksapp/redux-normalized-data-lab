import { EntityActionType } from '@constants';
import { normalizedEntitiesState } from '@states/normalizedEntitiesState';

describe('normalizedEntitiesState', () => {
  it('Normalization of multiple entities with list action.', () => {
    const entities = [{ id: '1', name: 'name 1' }];
    const state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities,
        entityName: 'Users',
        queryKey: 'UsersList',
        schema: undefined,
      }
    );

    expect(state).toEqual({
      Users: {
        byId: {
          ['1']: { id: '1', name: 'name 1' },
        },
        allIds: ['1'],
        queries: [
          {
            ids: ['1'],
            queryKey: 'UsersList',
          },
        ],
      },
    });
  });

  it('Normalization of multiple entities with list action and passed query data.', () => {
    const entities = [
      { id: '1', name: 'name 1' },
      { id: '2', name: 'name 2' },
    ];
    const state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities,
        entityName: 'Users',
        queryKey: 'UsersList',
        pagination: { page: 0, size: 2, totalElements: 6, totalPages: 3 },
        schema: undefined,
      }
    );

    expect(state).toEqual({
      Users: {
        byId: {
          ['1']: { id: '1', name: 'name 1' },
          ['2']: { id: '2', name: 'name 2' },
        },
        allIds: ['1', '2'],
        queries: [
          {
            ids: ['1', '2'],
            queryKey: 'UsersList',
            pagination: { page: 0, size: 2, totalElements: 6, totalPages: 3 },
            calculatedPagination: {
              page: 0,
              size: 2,
              totalElements: 6,
              totalPages: 3,
            },
          },
        ],
      },
    });
  });

  it('Normalization of multiple set of entities with a pagination gap.', () => {
    const entities1 = [
      { id: '1', name: 'name 1' },
      { id: '2', name: 'name 2' },
    ];
    const pagination1 = { page: 0, size: 2, totalElements: 6, totalPages: 3 };
    let state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities: entities1,
        entityName: 'Users',
        queryKey: 'UsersList',
        pagination: pagination1,
        schema: undefined,
      }
    );

    const entities2 = [
      { id: '5', name: 'name 5' },
      { id: '6', name: 'name 6' },
    ];
    const pagination2 = { page: 2, size: 2, totalElements: 6, totalPages: 3 };
    state = normalizedEntitiesState(state, {
      type: EntityActionType.LIST,
      entities: entities2,
      entityName: 'Users',
      queryKey: 'UsersList',
      pagination: pagination2,
      schema: undefined,
    });

    expect(state).toEqual({
      Users: {
        byId: {
          ['1']: { id: '1', name: 'name 1' },
          ['2']: { id: '2', name: 'name 2' },
          ['5']: { id: '5', name: 'name 5' },
          ['6']: { id: '6', name: 'name 6' },
        },
        allIds: ['1', '2', '5', '6'],
        queries: [
          {
            ids: ['1', '2', undefined, undefined, '5', '6'],
            queryKey: 'UsersList',
            pagination: { page: 2, size: 2, totalElements: 6, totalPages: 3 },
            calculatedPagination: {
              page: 2,
              size: 2,
              totalElements: 6,
              totalPages: 3,
            },
          },
        ],
      },
    });
  });

  it('Dispatch update action.', () => {
    const entities1 = [{ id: '1', name: 'name 1' }];
    let state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities: entities1,
        queryKey: 'UsersList',
        entityName: 'Users',
        schema: undefined,
      }
    );

    state = normalizedEntitiesState(state, {
      type: EntityActionType.UPDATE,
      entity: { id: '1', name: 'updated name 1' },
      entityName: 'Users',
      schema: undefined,
    });

    expect(state).toEqual({
      Users: {
        byId: {
          ['1']: { id: '1', name: 'updated name 1' },
        },
        allIds: ['1'],
        queries: [
          {
            ids: ['1'],
            queryKey: 'UsersList',
          },
        ],
      },
    });
  });

  it('Dispatch remove action.', () => {
    const entities1 = [{ id: '1', name: 'name 1' }];
    let state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities: entities1,
        queryKey: 'UsersList',
        entityName: 'Users',
        pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
        schema: undefined,
      }
    );

    state = normalizedEntitiesState(state, {
      type: EntityActionType.REMOVE,
      entityId: '1',
      entityName: 'Users',
      schema: { foreignKeys: [] },
    });

    expect(state).toEqual({
      Users: {
        byId: {},
        allIds: [],
        queries: [
          {
            ids: [],
            queryKey: 'UsersList',
            pagination: { page: 0, size: 10, totalElements: 0, totalPages: 0 },
            calculatedPagination: {
              page: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
          },
        ],
      },
    });
  });

  it('Dispatch remove action of entity with foreign key.', () => {
    const entities1 = [{ id: '1', name: 'name 1', comments: ['1', '2'] }];
    let state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities: entities1,
        queryKey: 'VideosList',
        entityName: 'Videos',
        pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
        schema: undefined,
      }
    );

    const entities2 = [{ id: '1', name: 'I liked the video', videoId: '1' }];
    state = normalizedEntitiesState(state, {
      type: EntityActionType.LIST,
      entities: entities2,
      queryKey: 'CommentsList',
      entityName: 'Videos.Comments',
      schema: undefined,
    });

    expect(state).toEqual({
      Videos: {
        byId: { '1': { id: '1', name: 'name 1', comments: ['1', '2'] } },
        allIds: ['1'],
        queries: [
          {
            ids: ['1'],
            queryKey: 'VideosList',
            pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
            calculatedPagination: {
              page: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
          },
        ],
      },
      'Videos.Comments': {
        byId: { '1': { id: '1', name: 'I liked the video', videoId: '1' } },
        allIds: ['1'],
        queries: [
          {
            ids: ['1'],
            queryKey: 'CommentsList',
          },
        ],
      },
    });

    state = normalizedEntitiesState(state, {
      type: EntityActionType.REMOVE,
      entityId: '1',
      entityName: 'Videos.Comments',
      schema: {
        foreignKeys: [
          {
            foreignEntityName: 'Videos',
            foreignKeyName: 'videoId',
            foreignFieldName: 'comments',
          },
        ],
      },
    });

    expect(state).toEqual({
      Videos: {
        byId: { '1': { id: '1', name: 'name 1', comments: ['2'] } },
        allIds: ['1'],
        queries: [
          {
            ids: ['1'],
            queryKey: 'VideosList',
            pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
            calculatedPagination: {
              page: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
          },
        ],
      },
      'Videos.Comments': {
        byId: {},
        allIds: [],
        queries: [
          {
            ids: [],
            queryKey: 'CommentsList',
          },
        ],
      },
    });
  });

  it('Dispatch remove action of entity with multiple foreign keys.', () => {
    const entities1 = [
      { id: '1', name: 'Business 1', associatedContacts: ['1', '2'] },
      { id: '2', name: 'Business 2', associatedContacts: ['1'] },
    ];
    let state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities: entities1,
        queryKey: 'BusinessesList',
        entityName: 'Businesses',
        pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
        schema: undefined,
      }
    );

    const entities2 = [
      { id: '1', name: 'Contact 1', businessesIds: ['1', '2'] },
    ];
    state = normalizedEntitiesState(state, {
      type: EntityActionType.LIST,
      entities: entities2,
      queryKey: 'ContactsList',
      entityName: 'Contacts',
      schema: undefined,
    });

    expect(state).toEqual({
      Businesses: {
        byId: {
          '1': { id: '1', name: 'Business 1', associatedContacts: ['1', '2'] },
          '2': { id: '2', name: 'Business 2', associatedContacts: ['1'] },
        },
        allIds: ['1', '2'],
        queries: [
          {
            ids: ['1', '2'],
            queryKey: 'BusinessesList',
            pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
            calculatedPagination: {
              page: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
          },
        ],
      },
      Contacts: {
        byId: {
          '1': { id: '1', name: 'Contact 1', businessesIds: ['1', '2'] },
        },
        allIds: ['1'],
        queries: [
          {
            ids: ['1'],
            queryKey: 'ContactsList',
          },
        ],
      },
    });

    state = normalizedEntitiesState(state, {
      type: EntityActionType.REMOVE,
      entityId: '1',
      entityName: 'Contacts',
      schema: {
        foreignKeys: [
          {
            foreignEntityName: 'Businesses',
            foreignKeyName: 'businessesIds',
            foreignFieldName: 'associatedContacts',
          },
        ],
      },
    });

    expect(state).toEqual({
      Businesses: {
        byId: {
          '1': { id: '1', name: 'Business 1', associatedContacts: ['2'] },
          '2': { id: '2', name: 'Business 2', associatedContacts: [] },
        },
        allIds: ['1', '2'],
        queries: [
          {
            ids: ['1', '2'],
            queryKey: 'BusinessesList',
            pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
            calculatedPagination: {
              page: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
          },
        ],
      },
      Contacts: {
        byId: {},
        allIds: [],
        queries: [
          {
            ids: [],
            queryKey: 'ContactsList',
          },
        ],
      },
    });
  });

  it('Dispatch remove action of entity with multiple foreign keys and the relationship is not an array.', () => {
    const entities1 = [
      { id: '1', name: 'Business 1', associatedContact: '1' },
      { id: '2', name: 'Business 2', associatedContact: '1' },
    ];
    let state = normalizedEntitiesState(
      {},
      {
        type: EntityActionType.LIST,
        entities: entities1,
        queryKey: 'BusinessesList',
        entityName: 'Businesses',
        pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
        schema: undefined,
      }
    );

    const entities2 = [
      { id: '1', name: 'Contact 1', businessesIds: ['1', '2'] },
    ];
    state = normalizedEntitiesState(state, {
      type: EntityActionType.LIST,
      entities: entities2,
      queryKey: 'ContactsList',
      entityName: 'Contacts',
      schema: undefined,
    });

    expect(state).toEqual({
      Businesses: {
        byId: {
          '1': { id: '1', name: 'Business 1', associatedContact: '1' },
          '2': { id: '2', name: 'Business 2', associatedContact: '1' },
        },
        allIds: ['1', '2'],
        queries: [
          {
            ids: ['1', '2'],
            queryKey: 'BusinessesList',
            pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
            calculatedPagination: {
              page: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
          },
        ],
      },
      Contacts: {
        byId: {
          '1': { id: '1', name: 'Contact 1', businessesIds: ['1', '2'] },
        },
        allIds: ['1'],
        queries: [
          {
            ids: ['1'],
            queryKey: 'ContactsList',
          },
        ],
      },
    });

    state = normalizedEntitiesState(state, {
      type: EntityActionType.REMOVE,
      entityId: '1',
      entityName: 'Contacts',
      schema: {
        foreignKeys: [
          {
            foreignEntityName: 'Businesses',
            foreignKeyName: 'businessesIds',
            foreignFieldName: 'associatedContact',
          },
        ],
      },
    });

    expect(state).toEqual({
      Businesses: {
        byId: {
          '1': { id: '1', name: 'Business 1', associatedContact: undefined },
          '2': { id: '2', name: 'Business 2', associatedContact: undefined },
        },
        allIds: ['1', '2'],
        queries: [
          {
            ids: ['1', '2'],
            queryKey: 'BusinessesList',
            pagination: { page: 0, size: 10, totalElements: 1, totalPages: 1 },
            calculatedPagination: {
              page: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
          },
        ],
      },
      Contacts: {
        byId: {},
        allIds: [],
        queries: [
          {
            ids: [],
            queryKey: 'ContactsList',
          },
        ],
      },
    });
  });
});
