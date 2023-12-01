import request from '@/api'

const manageService = {
  total: () => {
    return request.get('/manage/panel/total', {})
  },
}
export default manageService

