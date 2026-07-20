
export class PostResponseDto {
  id: string;
  username: string;
  text: string;
  imageUrl: string;
  likeBy: LikeList[];
  numberLikes: number;
  commentsCount: number;
  createdAt: Date;
}

export class LikeList{
  id: string;
  username: string;
}
