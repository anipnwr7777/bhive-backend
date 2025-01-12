const port = process.env.PORT || 3000;
const app = require("./app");

app.listen(port, () => {
    console.info(`Server running on port: ${port}`);
});