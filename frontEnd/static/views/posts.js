import abstract from "./abstract.js";

export default class extends abstract {
    constructor(params) {
        super(params);
        this.setTitle("Posts");
    }

    async getHtml() {
        return  `
            <h1> View Posts </h1>

            <p> Post one </p>

            <p> 
            <a href="/" data-link>Go To Main Page</a>
            </p>

        `;

    }
}