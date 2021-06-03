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

export { IsmallPathes, Icar, IcarsQueryParams };
