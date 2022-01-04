import axios from "axios";

let MusicUrl = "http://localhost:3000"

//获取发现歌单中的歌单列表 ; 可选参数 : limit: 取出数量 , 默认为 30 (不支持 offset)
export function getMusicList(musiclimit) {
    return axios.get(`${MusicUrl}/personalized?limit=${musiclimit}`)  //有参数时需要使用泛引号: `
}
//新碟上架
export function getAlbum() {
    return axios.get(`${MusicUrl}/album/newest`)  //有参数时需要使用泛引号: `
}
//歌手榜
export function getArtist() {
    return axios.get(`${MusicUrl}/toplist/artist`)  //有参数时需要使用泛引号: `
}
//获取精品歌单
export function getTopplaylist(cat,offset) {
    return axios.get(`${MusicUrl}/top/playlist?order=hot&cat=${cat}&limit=35&offset=${offset}`)  //有参数时需要使用泛引号: `
}
//获取歌单分类
export function getCatlist() {
    return axios.get(`${MusicUrl}/playlist/catlist`)  //有参数时需要使用泛引号: `
}
//获得歌单详情
export function getDetail(id,cookie) {
    return axios.get(`${MusicUrl}/playlist/detail?id=${id}&cookie=${cookie}`)  //有参数时需要使用泛引号: `
}
//收藏歌单
export function getPlaylistSubscribe(t,id,cookie,timestamp) {
    return axios.get(`${MusicUrl}/playlist/subscribe?t=${t}&id=${id}&cookie=${cookie}&timestamp=${timestamp}`)  //有参数时需要使用泛引号: `
}
//获取歌单详情动态
export function getDynamic(id) {
    return axios.get(`${MusicUrl}/playlist/detail/dynamic?id=${id}`)  //有参数时需要使用泛引号: `
}
//获取歌单评论
export function getComment(id,offset,cookie,timestamp) {
    return axios.get(`${MusicUrl}/comment/playlist?id=${id}&offset=${offset}&cookie=${cookie}&timestamp=${timestamp}`)  //有参数时需要使用泛引号: `
}
//获取歌曲详情
export function getSong(id) {
    return axios.get(`${MusicUrl}/song/detail?ids=${id}`)  //有参数时需要使用泛引号: `
}
//收藏歌曲
export function getSongTracks(op,pid,tracks,cookie) {
    return axios.get(`${MusicUrl}/playlist/tracks?op=${op}&pid=${pid}&tracks=${tracks}&cookie=${cookie}`)  //有参数时需要使用泛引号: `
}
//获取歌词
export function getLyric(id) {
    return axios.get(`${MusicUrl}/lyric?id=${id}`)  //有参数时需要使用泛引号: `
}
//获取歌曲评论
export function getMusicComment(id,offset,cookie,timestamp) {
    return axios.get(`${MusicUrl}/comment/music?id=${id}&offset=${offset}&cookie=${cookie}&timestamp=${timestamp}`)  //有参数时需要使用泛引号: `
}
//获取歌曲Url
export function getMusicUrl(id) {
    return axios.get(`${MusicUrl}/song/url?id=${id}`)  //有参数时需要使用泛引号: `
}
//获取歌手分类列表
export function getArtistList(area,type) {
    return axios.get(`${MusicUrl}/artist/list?area=${area}&type=${type}&limit=40`)  //有参数时需要使用泛引号: `
}
//获取歌手详情
export function getArtistDetail(id) {
    return axios.get(`${MusicUrl}/artist/detail?id=${id}`)  //有参数时需要使用泛引号: `
}
//获取歌手所有歌曲
export function getArtistSongs(id) {
    return axios.get(`${MusicUrl}/artist/songs?id=${id}`)  //有参数时需要使用泛引号: `
}
//获取全部新碟
export function getNewAlbum(area,offset) {
    return axios.get(`${MusicUrl}/album/new?area=${area}&offset=${offset}&limit=35`)  //有参数时需要使用泛引号: `
}
//获取专辑内容
export function getAlbumContent(id) {
    return axios.get(`${MusicUrl}/album?id=${id}`)  //有参数时需要使用泛引号: `
}
//获取专辑详情
export function getAlbumDynamic(id) {
    return axios.get(`${MusicUrl}/album/detail/dynamic?id=${id}`)  //有参数时需要使用泛引号: `
}
//收藏专辑
export function getAlbumSub(t,id,cookie) {
    return axios.get(`${MusicUrl}/album/sub?t=${t}&id=${id}&cookie=${cookie}`)  //有参数时需要使用泛引号: `
}
//获取专辑评论
export function getAlbumComment(id,offset,cookie,timestamp) {
    return axios.get(`${MusicUrl}/comment/album?id=${id}&offset=${offset}&cookie=${cookie}&timestamp=${timestamp}`)  //有参数时需要使用泛引号: `
}
//搜索
export function getCloudsearch(keywords,type) {
    return axios.get(`${MusicUrl}/cloudsearch?keywords=${keywords}&type=${type}`)  //有参数时需要使用泛引号: `
}
//搜索建议
export function getSuggest(keywords) {
    return axios.get(`${MusicUrl}/search/suggest?keywords=${keywords}`)  //有参数时需要使用泛引号: `
}
//手机登录
export function getCellphone(phone,password,cookie) {
    withCredentials: true
    return axios.get(`${MusicUrl}/login/cellphone?phone=${phone}&password=${password}&cookie=${cookie}`)  //有参数时需要使用泛引号: `
}
//获取用户个人信息
export function getUserdetail(Uid) {
    return axios.get(`${MusicUrl}/user/detail?uid=${Uid}`)  //有参数时需要使用泛引号: `
}
//获取用户歌单
export function getUserplaylist(Uid) {
    return axios.get(`${MusicUrl}/user/playlist?uid=${Uid}&limit=70`)  //有参数时需要使用泛引号: `
}
//退出登录
export function getLogout() {
    return axios.get(`${MusicUrl}/logout`)  //有参数时需要使用泛引号: `
}
//发送评论or回复评论
export function getCommentContent(t,type,id,content,commentId,cookie,timestamp) {
    return axios.get(`${MusicUrl}/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}&cookie=${cookie}&timestamp=${timestamp}`)  //有参数时需要使用泛引号: `
}
//给评论点赞
export function getCommentLike(id,cid,t,type,cookie,timestamp) {
    return axios.get(`${MusicUrl}/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}&cookie=${cookie}&timestamp=${timestamp}`)  //有参数时需要使用泛引号: `
}
//分享动态
export function getShareresource(type,id,msg,cookie) {
    return axios.get(`${MusicUrl}/share/resource?type=${type}&id=${id}&msg=${msg}&cookie=${cookie}`)  //有参数时需要使用泛引号: `
}
//获取最新MV
export function getMvFirst() {
    return axios.get(`${MusicUrl}/mv/first?limit=6`)  //有参数时需要使用泛引号: `
}
//获取全部MV
export function getMvAll(area,type,order,offset) {
    return axios.get(`${MusicUrl}/mv/all?area=${area}&type=${type}&order=${order}&offset=${offset}&limit=36`)  //有参数时需要使用泛引号: `
}
//获取MV详情
export function getMvDetail(id) {
    return axios.get(`${MusicUrl}/mv/detail?mvid=${id}`)  //有参数时需要使用泛引号: `
}
//获取MV点赞转发评论数
export function getMvDetailInfo(id) {
    return axios.get(`${MusicUrl}/mv/detail/info?mvid=${id}`)  //有参数时需要使用泛引号: `
}
//MV地址
export function getMvUrl(id,r) {
    return axios.get(`${MusicUrl}/mv/url?id=${id}&r=${r}`)  //有参数时需要使用泛引号: `
}
//相关MV
export function getMvSimi(id) {
    return axios.get(`${MusicUrl}/simi/mv?mvid=${id}`)  //有参数时需要使用泛引号: `
}
//获取MV评论
export function getMvComment(id,offset,cookie,timestamp) {
    return axios.get(`${MusicUrl}/comment/mv?id=${id}&offset=${offset}&cookie=${cookie}&timestamp=${timestamp}&limit=20`)  //有参数时需要使用泛引号: `
}
//点赞资源（MV，视频，电台）
export function getResourceLike(t,type,id,cookie) {
    return axios.get(`${MusicUrl}/resource/like?t=${t}&type=${type}&id=${id}&cookie=${cookie}`)  //有参数时需要使用泛引号: `
}
//收藏MV
export function getMvSub(t,id,cookie) {
    return axios.get(`${MusicUrl}/mv/sub?t=${t}&mvid=${id}&cookie=${cookie}`)  //有参数时需要使用泛引号: `
}
export default {
    //推荐歌单
    getMusicList,
    //新碟上家
    getAlbum,
    //歌手榜
    getArtist,
    //获取歌单
    getTopplaylist,
    //获取歌单分类
    getCatlist,
    //获得歌单详情
    getDetail,
    //收藏歌单
    getPlaylistSubscribe,
    //获取歌单歌曲详情
    getDynamic,
    //获取歌单评论
    getComment,
    //获取歌曲详情
    getSong,
    //收藏歌曲
    getSongTracks,
    //获取歌词
    getLyric,
    //获取歌曲评论
    getMusicComment,
    //获取歌曲Url
    getMusicUrl,
    //获取歌手分类列表
    getArtistList,
    //获取歌手详情
    getArtistDetail,
    //获取歌手所有歌曲
    getArtistSongs,
    //获取全部新碟
    getNewAlbum,
    //获取专辑内容
    getAlbumContent,
    //获取专辑详情
    getAlbumDynamic,
    //收藏专辑
    getAlbumSub,
    //获取专辑评论
    getAlbumComment,
    //搜索
    getCloudsearch,
    //搜索建议
    getSuggest,
    //手机号码登录
    getCellphone,
    //获取用户个人信息
    getUserdetail,
    //获取用户歌单
    getUserplaylist,
    //退出登录
    getLogout,
    //发送评论or回复评论
    getCommentContent,
    //给评论点赞
    getCommentLike,
    //分享动态
    getShareresource,
    //获取最新MV
    getMvFirst,
    //获取全部MV
    getMvAll,
    //获取MV详情
    getMvDetail,
    //获取MV点赞转发评论数
    getMvDetailInfo,
    //MV地址
    getMvUrl,
    //相关MV
    getMvSimi,
    //获取MV评论
    getMvComment,
    //点赞资源（MV，视频，电台）
    getResourceLike,
    //收藏MV
    getMvSub,
}