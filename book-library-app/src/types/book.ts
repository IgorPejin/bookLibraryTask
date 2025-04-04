export default interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  recommendations?: number;
  nonrecommendations?: number;
  isSoftDeleted?: boolean;
  isSelected?: boolean;
}
