module.exports = {
    client: {
        includes: ["./src/**/*.tsx"],
        tagName: 'gql',
        service: {
            name: "kings-restaurants-backend",
            url: "http://localhost:4500/graphql",
        },
    },
}