import { Module } from '@nestjs/common';
import { ClientService } from './client.service';

/**
 * Módulo `ClientModule` que disponibiliza o `ClientService` para outras partes da aplicação.
 */

@Module({
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
