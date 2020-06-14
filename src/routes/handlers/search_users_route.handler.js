const GithubRepository = require('../../repository/http/github.repository');

module.exports = async (request) => {
    const {searchTerm, page, pageSize } = request.query;
    const userResults = await GithubRepository.searchForUser(searchTerm, page, pageSize);

    const users = await Promise.all(
        userResults.items.map(async (user) => {
            return await GithubRepository.getUserInfo(user.url);
        })
    );

    userResults.items = users;

    return userResults;
}