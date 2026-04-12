import { PostCategory } from '@/types'

export const postCategoryLabels: Record<PostCategory, string> = {
  post: 'Post',
  'bite-sized': 'Bite-sized'
}

export const postCategoryDescriptions: Record<PostCategory, string> = {
  post: 'Long-form deep dive',
  'bite-sized': 'Short practical update'
}

export function getPostCategoryLabel(category: PostCategory) {
  return postCategoryLabels[category]
}
