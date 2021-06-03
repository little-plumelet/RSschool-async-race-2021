interface IsmallPathes {
  garage: string,
  winners: string,
}

interface Icar {
  name: string,
  color: string
}

interface IcarsQueryParams {
  key?: '_page' | '_limit',
  value?: number,
}

interface Iwinner {
  id: number,
  wins: number,
  time: number,
}

interface IwinnersQueryParams {
  limitOrPage?: {
    key?: '_page' | '_limit'
    value?: number,
  },
  sort?: {
    key?: '_sort',
    value?: 'id' | 'wins' | 'time',
  },
  sortOrder?: {
    key?: '_order',
    value?: 'ASC' | 'DESC',
  }
}

export {
  IsmallPathes,
  Icar,
  IcarsQueryParams,
  Iwinner,
  IwinnersQueryParams,
};
