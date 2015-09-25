import articles from '../fixture/articles';
import comments from '../fixture/comments';

export default function(nock) {
    const server = nock('http://localhost');

    server
        .get('/articles')
        .reply(200, articles);

    articles.forEach((article) => {
        server
            .get(`/articles/${article._id}`)
            .reply(200, article);

        if (!comments[article._id]) {
            return;
        }

        server
            .get(`/articles/${article._id}/comments`)
            .reply(200, comments[article._id]);

        comments[article._id].forEach((comment) => {
            server
                .get(`/articles/${article._id}/comments/${comment.id}`)
                .reply(200, comment);
        });
    });

    return server;
}
