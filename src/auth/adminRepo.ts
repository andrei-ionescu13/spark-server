import { Model } from 'mongoose';
import { Admin } from './model';

export interface AdminRepoI {
  createAdmin: any;
  exists: any;
  findByUsername: any;
  getAdmin: any;
}

export class AdminRepo implements AdminRepoI {
  constructor(private adminModel: Model<Admin>) {}

  createAdmin = (props) => this.adminModel.create(props);

  exists = async (username) => !!(await this.adminModel.findOne({ username: username }));

  findByUsername = (username) => this.adminModel.findOne({ username: username });

  getAdmin = (id) => this.adminModel.findOne({ _id: id });
}
