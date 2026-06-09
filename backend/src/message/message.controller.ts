import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageEntity } from './entities';
import { GetMessagesData } from './dto';
import { DEFAULT_MESSAGE_LIMIT, DEFAULT_MESSAGE_OFFSET } from './constants';
import { Public } from 'src/shared/decorators';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Fetch messages by stream id' })
  @ApiResponse({ status: 200, type: [MessageEntity] })
  @HttpCode(200)
  async getMessages(@Query() query: GetMessagesData) {
    const { limit = DEFAULT_MESSAGE_LIMIT, offset = DEFAULT_MESSAGE_OFFSET } =
      query;

    const data: GetMessagesData = {
      streamId: query.streamId,
      limit,
      offset,
    };

    return await this.messageService.getMessages(data);
  }
}
