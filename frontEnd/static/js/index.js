import MainPage from "../views/MainPage.js";
import posts from "../views/posts.js";
import postView from "../views/postView.js";


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}


//creating router for our tags
const router = async () => {

    const routes = [
        {path: "/", view: MainPage},
        // {path: "/LoggedIn", view: () => console.log("viewing Logged In Page")},    
        // {path: "/Profile", view: () => console.log("viewing user Profile")},    
        {path: "/Posts", view: posts},
        {path: "/Posts/:id", view: postView},   
        // {path: "/Chats", view: () => console.log("viewing chats")},
        // {path: "/Users", view: () => console.log("viewing Users")},       

    ];

    //test each route for matches
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [location.pathname]
        }
    }

    const view = new match.route.view(getParams(match));

    document.querySelector("#app").innerHTML = await view.getHtml();

};

//this is for previous pages to be accessed.
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if(e.target.matches("[data-link")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    })

    router();
})