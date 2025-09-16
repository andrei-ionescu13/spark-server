import { Model } from 'mongoose';
import { TokenDoc } from './model';
import { Token } from './token';
import { ToukenMapper } from './tokenMapper';

export interface TokenRepoI {
  createToken: (props: any) => Promise<Token>;
  findOne: (token: string, admin: string) => Promise<Token | null>;
}

export class TokenRepo implements TokenRepoI {
  constructor(private tokenModel: Model<TokenDoc>) {}

  createToken = async (props: any) => {
    const entity = await this.tokenModel.create(props);
    return ToukenMapper.toDomain(entity);
  };

  findOne = async (token: string, admin: string) => {
    const entity = await this.tokenModel.findOne({ token, admin });
    if (!entity) return null;

    return ToukenMapper.toDomain(entity);
  };
}
