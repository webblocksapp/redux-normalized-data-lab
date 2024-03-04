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
      }
    );

    expect(state).toMatchObject({
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
        queryData: {
          pagination: { page: 0, size: 2, totalElements: 6, totalPages: 3 },
        },
      }
    );

    expect(state).toMatchObject({
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
            queryData: {
              pagination: { page: 0, size: 2, totalElements: 6, totalPages: 3 },
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
        queryData: {
          pagination: pagination1,
        },
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
      queryData: {
        pagination: pagination2,
      },
    });

    expect(state).toMatchObject({
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
            queryData: {
              pagination: { page: 2, size: 2, totalElements: 6, totalPages: 3 },
            },
          },
        ],
      },
    });
  });
});