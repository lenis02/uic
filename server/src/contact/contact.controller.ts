import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  sendContactEmail(@Body() contactDto: ContactDto) {
    this.contactService.sendEmail(contactDto);
    return { success: true, message: '문의가 성공적으로 접수되었습니다.' };
  }
}
