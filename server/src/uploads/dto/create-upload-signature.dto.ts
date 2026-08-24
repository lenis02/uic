import { IsIn } from 'class-validator';
import { UPLOAD_KINDS, type UploadKind } from '../upload-presets';

export class CreateUploadSignatureDto {
  @IsIn(UPLOAD_KINDS as unknown as string[])
  kind: UploadKind;
}
