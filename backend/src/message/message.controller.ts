import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageEntity } from './entities';
import { GetMessagesData } from './dto';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch messages by stream id' })
  @ApiResponse({ status: 200, type: [MessageEntity] })
  @HttpCode(200)
  async getMessages(@Query() query: GetMessagesData) {
    return await this.messageService.getMessages(query);
  }
}
