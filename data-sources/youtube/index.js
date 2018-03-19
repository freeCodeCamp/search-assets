const Rx = require('rxjs');
const { google } = require('googleapis');
const { chunkDocument } = require('../../utils');

const { Observable } = Rx;
const { YOUTUBE_SECRET } = process.env;
const youtube = google.youtube({ version: 'v3', auth: YOUTUBE_SECRET });

function getPlaylistItems(
  { playlistId, playlistTitle },
  nextPage,
  currentItems = []
) {
  return Observable.fromPromise(
    new Promise((resolve, reject) => {
      youtube.playlistItems.list(
        {
          part: 'snippet',
          playlistId,
          pageToken: nextPage ? nextPage : ''
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve({ ...data.data, playlistTitle });
        }
      );
    })
  ).flatMap(({ nextPageToken, items, playlistTitle }) => {
    const allItems = currentItems.concat(items);
    return Observable.if(
      () => !!nextPageToken,
      getPlaylistItems({ playlistId, playlistTitle }, nextPageToken, allItems),
      Observable.of({ videos: allItems, playlistTitle })
    );
  });
}

function getPlayLists(nextPage, currentItems = []) {
  return Observable.fromPromise(
    new Promise((resolve, reject) => {
      youtube.playlists.list(
        {
          auth: YOUTUBE_SECRET,
          part: 'snippet',
          channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
          pageToken: nextPage ? nextPage : ''
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data.data);
        }
      );
    })
  ).flatMap(({ nextPageToken, items }) => {
    const allItems = items.concat(currentItems);
    return Observable.if(
      () => !!nextPageToken,
      getPlayLists(nextPageToken, allItems),
      Observable.of(allItems)
    );
  });
}

exports.getYoutubeData = function getYoutubeData() {
  return getPlayLists()
    .flatMap(playlists => {
      return Observable.from(playlists).concatMap(
        ({ id, snippet: { title } }) =>
          getPlaylistItems({ playlistId: id, playlistTitle: title })
      );
    })
    .flatMap(({ videos, playlistTitle }) => {
      const formattedVideos = videos
        .map(video => {
          const {
            id,
            snippet: { title, description, resourceId: { videoId }, thumbnails }
          } = video;
          return {
            id,
            videoId,
            title,
            description,
            thumbnails,
            playlistTitle
          };
        })
        .reduce(
          (chunked, current) => [
            ...chunked,
            ...chunkDocument(
              current,
              ['id', 'videoId', 'title', 'thumbnail', 'playlistTitle'],
              'description'
            )
          ],
          []
        );
      return Observable.of(formattedVideos);
    });
};
