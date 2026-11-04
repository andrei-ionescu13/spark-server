export interface UpdateKeysStatusRequestDto {
  keyId: string;
  status: 'secret' | 'revealed' | 'reported';
}
