const connection = require('../../database/connection');

module.exports = {
    async like(request, response) {
        const { TargetId } = request.params;
        const UserId = request.body;

        const loggedUser = await connection('investidores').where('id', UserId.UserId);

        const targetUser = await connection('consultores').where('id', TargetId);

        if (!targetUser) {
            return response.status(404).json({error: 'Usuário não encontrado!'});
        }

        const oldLikes = loggedUser[0].likes;

        const matcheck = targetUser[0].likes;

        if (matcheck !== null && matcheck.search(loggedUser[0].id) !== -1) {
            const OldMatches = loggedUser[0].matches;
            const OldMatches2 = targetUser[0].matches;

            const newMatches = `${OldMatches} ${targetUser[0].id}`;
            const newMatches2 = `${OldMatches2} ${loggedUser[0].id}`;

            await connection('investidores').where('id', UserId.UserId).update({ matches: newMatches });
            await connection('consultores').where('id', TargetId).update({ matches: newMatches2 });
        }

        const newLikes = `${oldLikes} ${targetUser[0].id}`;

        await connection('investidores').where('id', UserId.UserId).update({likes: newLikes});

        return response.json(loggedUser);
    }
}
