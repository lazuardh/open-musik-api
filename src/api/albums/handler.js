class AlbumsHandler {
  constructor(service) {
    this._service = service;
  }

  postAlbumHandler(request, h) {
    try {
      const { name = "unnamed", year } = request.payload;

      const albumId = this._service.addAlbum({ name, year });

      const response = h.response({
        status: "success",
        data: {
          albumId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });

      response.code(400);
      return response;
    }
  }

  getAlbumHandlerById(request, h) {
    try {
      const { id } = request.params;
      const album = this._service.getAlbumByid(id);

      return {
        status: "success",
        data: {
          album,
        },
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  putAlbumHandlerById(request, h) {
    try {
      const { id } = request.params;

      this._service.editAlbumById(id, request.payload);

      return {
        status: "success",
        message: "Album berhasil diperbarui",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });

      response.code(404);
      return response;
    }
  }

  deleteAlbumHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteAlbumById(id);

      return {
        status: "succcess",
        message: "Album berhasil dihapus",
      };
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: error.message,
        });

        response.code(404);
        return response;
    }
  }
}

module.exports = AlbumsHandler;