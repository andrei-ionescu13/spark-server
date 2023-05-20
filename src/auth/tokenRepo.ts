import { Model } from 'mongoose';
import { Token } from './model';

export interface TokenRepoI {
  createToken: any;
  findOne: any;
}

export class TokenRepo implements TokenRepoI {
  constructor(private tokenModel: Model<Token>) {}

  createToken = (props) => this.tokenModel.create(props);

  findOne = async (token, admin) => this.tokenModel.findOne({ token, admin });

  // findByUsername = (username) => this.tokenModel.findOne({ username: username })
}
