import abstract from "./abstract.js";

export default class extends abstract {
    constructor() {
        super();
        this.setTitle("Main Page");
    }

    async getHtml() {
        return  `
            <h1> Main Page </h1>

            <p> This is our Main Page </p>

            <p> 
            <a href="/Posts" data-link>View Recent Posts</a>
            </p>

        `;

    }
}