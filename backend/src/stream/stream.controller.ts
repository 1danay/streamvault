import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators';
import { CreateStreamDto, StreamResponse, UpdateStreamDto } from './dto';

@ApiTags('stream')
@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post()
  @ApiOperation({ summary: 'Create livestream' })
  @ApiResponse({ status: 201, type: StreamResponse })
  @HttpCode(201)
  async createStream(
    @Body() dto: CreateStreamDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.streamService.createStream(dto, userId);
  }

  @Put(':streamId')
  @ApiOperation({ summary: 'Update livestream by id' })
  @ApiResponse({ status: 200, type: StreamResponse })
  @HttpCode(200)
  async updateStream(
    @Body() dto: UpdateStreamDto,
    @Param('streamId') streamId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.streamService.updateStream(dto, streamId, userId);
  }

  @Get(':streamId')
  @ApiOperation({ summary: 'Find stream by id' })
  @ApiResponse({
    status: 200,
    type: StreamResponse,
    nullable: true,
  })
  @HttpCode(200)
  async getStreamById(@Param('streamId') streamId: string) {
    return this.streamService.findById(streamId);
  }

  @Get()
  @ApiOperation({ summary: 'Find all active streams' })
  @ApiResponse({ status: 200, type: StreamResponse, isArray: true })
  @HttpCode(200)
  async getAllStreams() {
    return this.streamService.findAll();
  }

  @Patch(':streamId/finish')
  @ApiOperation({ summary: 'End stream by id' })
  @ApiResponse({ status: 200, description: 'Stream successfully ended' })
  @HttpCode(200)
  async endStreamById(
    @Param('streamId') streamId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.streamService.endStream(streamId, userId);
  }

  @Delete(':streamId')
  @ApiOperation({ summary: 'Delete stream by id' })
  @ApiResponse({ status: 200, description: 'Stream successfully deleted' })
  @HttpCode(200)
  async deleteStreamById(
    @Param('streamId') streamId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.streamService.deleteStream(streamId, userId);
  }
}
