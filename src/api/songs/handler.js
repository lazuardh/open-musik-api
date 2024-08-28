const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: "success",
      message: "lagu berhasil ditambahkan",
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getAllSongs();
    const songsMapped = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));
    
    return {
      status: "success",
      data: {
        songs: songsMapped,
      },
    };
  }

  async getSongHandlerById(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    
    return {
      status: 'success',
      data: {
        song,
      }
    };
  }

  async putSongHandlerById(request){
    this._validator.validateSongPayload(request.payload);
    const  { id } = request.params;

    await this._service.editSongById(id, request.payload);
    
    return {
      status: 'success',
      message: 'lagu berhasil diperbarui',
    };
  }

  async deleteSongHandler(request){
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
