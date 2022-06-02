import { object, string } from "joi";
import { Query } from "mongoose";

export class APIFilter {
  private exludedFields = ["limit", "sort", "page", "fields"];
  constructor(
    public query: Query<any[], any, {}, any>,
    public queryString: { [key: string]: string },
    fieldToBeExclude:string[]=[]
  ) {
      this.exludedFields = [...this.exludedFields,...fieldToBeExclude]
  }

  filter() {
    const queryObj = { ...this.queryString };
    this.exludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(){
      if(this.queryString.sort){
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
      }else{
          this.query = this.query.sort('-createdAt');
      }
      return this;
  }

  limitFields(){
      if(this.queryString.fields){
          const fields = this.queryString.fields.split(',').join(' ');
          this.query = this.query.select(fields);
      }
      return this;
  }

  paginate(){
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 10;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
  }
}
