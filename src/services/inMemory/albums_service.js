const { nanoId } = require("nanoid");

class AlbumsService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const id = nanoId(16);

    const newAlbum = {
      id,
      name,
      year,
    };

    this._albums.push(newAlbum);

    const isSuccess =
      this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new Error("Album gagal ditambahkan");
    }

    return id;
  }

  getAlbums() {
    return this._albums;
  }

  getAlbumById(id) {
    const album = this._albums.filter((album) => album.id === id)[0];

    if (!album) {
        throw new Error('Album tidak ditemukan');
    }

    return album;
  }

  editAlbumById(id, { name, year }){
    const index = this._albums.findIndex((album) => album.id === id);

    if (!index === -1) {
        throw new Error('Gagal memperbaharui album. Id tidak ditemukan');
    }

    this._albums[index] = {
        ...this._albums[index],
        name,
        year,
    };
  }

  deleteAlbumById(id){
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
        throw new Error('Gagal memperbaharui album. Id tidak ditemukan');
    }

    this._albums.splice(index, 1);
  }
}

module.exports = AlbumsService;