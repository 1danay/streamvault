import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserData, UpdateProfileData, UsersRepository } from './repositories';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, SafeUserData, UpdateProfileDto, UserProfileResponse } from './dto';
import { MediaService } from 'src/media/media.service';
import { User, Prisma } from 'generated/prisma/client';
import { StreamService } from 'src/stream/stream.service';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mediaService: MediaService,
    private readonly streamService: StreamService,
  ) {}

  // Endpoints business logic
  public async findById(id: string): Promise<SafeUserData> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return this.toPublicResponse(user);
  }

  public async findByEmail(email: string): Promise<SafeUserData> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return this.toPublicResponse(user);
  }

  public async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const [profile, streams] = await Promise.all([
      this.toPublicResponse(user),
      this.streamService.findStreamsByUser(userId),
    ]);

    return {
      ...profile,
      streams,
    };
  }

  public async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UserProfileResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    if (dto.avatarFileId) {
      await this.mediaService.validateOwnedCompletedFile(
        dto.avatarFileId,
        userId,
      );
    }

    const updateData: UpdateProfileData = {};

    if (dto.username !== undefined) {
      updateData.username = dto.username;
    }

    if (dto.avatarFileId !== undefined) {
      updateData.avatarFileId = dto.avatarFileId;
    }

    try {
      const updatedUser = await this.usersRepository.update(userId, updateData);

      return this.getProfile(updatedUser.id);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('User with this username already exists');
      }
      throw e;
    }
  }

  // External functions
  public async findForAuth(email: string) {
    return await this.usersRepository.findByEmail(email);
  }

  public async createUser(dto: CreateUserDto): Promise<SafeUserData> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const data: CreateUserData = {
      email: dto.email,
      username: dto.username,
      passwordHash: hashedPassword,
    };

    const user = await this.usersRepository.create(data);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return this.toResponse(safeUser);
  }

  public async toPublicResponse(user: User): Promise<SafeUserData> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...withoutPassword } = user;
    return this.toResponse(withoutPassword);
  }

  private async toResponse(
    user: Omit<User, 'password'>,
  ): Promise<SafeUserData> {
    const avatarUrl = user.avatarFileId
      ? await this.mediaService.getFileUrl(user.avatarFileId)
      : null;

    return {
      ...user,
      avatarFileUrl: avatarUrl,
    };
  }
}
