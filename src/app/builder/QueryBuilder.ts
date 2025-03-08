import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  public page: number;
  public limit: number;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
    this.page = Number(query.page) || 1;
    this.limit = Number(query.limit) || 10;
  }

  search(searchableFields: string[]) {
    const search = this?.query?.search;
    if (search) {
      const searchCondition = {
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      };

      this.modelQuery = this.modelQuery.find(searchCondition);
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['search', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((key) => {
      if (
        typeof queryObj[key] === 'string' &&
        (queryObj[key] as string).includes(',')
      ) {
        queryObj[key] = { $in: (queryObj[key] as string).split(',') };
      }
    });

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const skip = (this.page - 1) * this.limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(this.limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  getCountQuery() {
    const baseQuery = this.modelQuery.getQuery();
    return this.modelQuery.model.countDocuments(baseQuery);
  }

  getPaginationInfo() {
    return {
      page: this.page,
      limit: this.limit,
    };
  }
}

export default QueryBuilder;
