import { Controller } from '@nestjs/common';
import { StreamService } from './stream.service';

@Controller()
export class StreamController {
  constructor(private readonly streamService: StreamService) {}
}
