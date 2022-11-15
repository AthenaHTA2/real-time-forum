import MainPage from "../views/MainPage.js";
import posts from "../views/posts.js";

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
        // {path: "/Chats", view: () => console.log("viewing chats")},
        // {path: "/Users", view: () => console.log("viewing Users")},       

    ];

    //test each route for matches
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

    if (!match) {
        match = {
            route: routes[0],
            isMatch : true
        }
    }

    const view = new match.route.view();

    document.querySelector("#app").innerHTML = await view.getHtml();

    console.log(match.route.view());
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