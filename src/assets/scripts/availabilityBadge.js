/* eslint-disable */

(function(e, r) {
    "use strict";
    var t = 2628e6;
    var a = r.__availability_base_url || "https://my.cushionapp.com";
    var i = "available";
    var n = "unavailable";
    var s = "soon";
    var u = "private";
    var l = function() {
        this.user = {};
        this.date = null;
        this.hours = 0;
        this.availability = n
    };
    l.prototype.isAvailable = function() {
        return i === this.availability
    };
    l.prototype.isUnavailable = function() {
        return n === this.availability
    };
    l.prototype.isSoon = function() {
        return s === this.availability
    };
    l.prototype.isPrivate = function() {
        return u === this.availability
    };
    l.prototype.monthShort = function() {
        if (!this.date)
            return;
        switch (this.date.getMonth()) {
            case 0:
                return "Jan";
            case 1:
                return "Feb";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "Aug";
            case 8:
                return "Sept";
            case 9:
                return "Oct";
            case 10:
                return "Nov";
            case 11:
                return "Dec"
        }
    };
    l.prototype.month = function() {
        if (!this.date)
            return;
        switch (this.date.getMonth()) {
            case 0:
                return "January";
            case 1:
                return "February";
            case 2:
                return "March";
            case 3:
                return "April";
            case 4:
                return "May";
            case 5:
                return "June";
            case 6:
                return "July";
            case 7:
                return "August";
            case 8:
                return "September";
            case 9:
                return "October";
            case 10:
                return "November";
            case 11:
                return "December"
        }
    };
    l.prototype.referralUrl = function() {
        if (this.user && this.user.referral_code) {
            return "http://get.cushionapp.com/" + this.user.referral_code
        }
    };
    function o(e) {
        if (!e.user)
            return console.error("Must specify a user");
        if (!e.render)
            return console.error("Must specify a render function");
        var r = new l;
        var t = new XMLHttpRequest;
        t.addEventListener("load", c(r, e.render));
        t.open("GET", a + "/api/v1/users/" + e.user + "/availability");
        t.send();
        return r
    }
    function c(e, r) {
        return function() {
            switch (this.status) {
                default:
                    return console.error("Cushion API Error", this.status);
                case 404:
                    return console.error("That user ID wasnt found");
                case 401:
                    console.error("Enable the Availability Badge: " + a + "/add-ons/availability-badge");
                    e.availability = u;
                    break;
                case 200:
                    var t = JSON.parse(this.response);
                    if (t.user)
                        e.user = t.user;
                    if (t.availability) {
                        e.date = v(t.availability.available_on);
                        e.hours = t.availability.hours_per_week;
                        e.availability = b(e.date)
                    }
                    break
            }
            return r.call(e)
        }
    }
    function v(e) {
        e = e.split("-");
        var r = parseInt(e[0]);
        var t = parseInt(e[1]) - 1;
        var a = parseInt(e[2]);
        return new Date(r, t, a)
    }
    function b(e) {
        var r = e - Date.now();
        if (e && r < t)
            return i;
        if (e && r < 10 * t)
            return s;
        return n
    }
    function h(e) {
        var r = Array.prototype.slice.call(arguments, 1);
        var t = document.createElement(e);
        if (r.length > 0) {
            r.unshift(t);
            d.apply(this, r)
        }
        return t
    }
    function f(e, r) {
        e.appendChild(r);
        return e
    }
    function d(e) {
        var r = Array.apply(null, arguments).slice(1);
        for (var t = r.length - 1; t >= 0; t--) {
            if (r[t].length === 3) {
                e.setAttributeNS.apply(e, r[t])
            } else {
                e.setAttribute.apply(e, r[t])
            }
        }
        return e
    }
    function p(e) {
        var r = e.container || document.body;
        var t = e.href;
        function a() {
            switch (this.availability) {
                case i:
                    return "Available";
                case s:
                    return "Available in " + this.monthShort();
                case n:
                    return "Not Available";
                case u:
                    return "Error"
            }
        }
        function l() {
            if (t === undefined)
                t = this.referralUrl();
            var e = h("div", [
                "class", "availability-ribbon " + this.availability
            ]);
            var i = h(
                t
                ? "a"
                : "div",
            [
                "href", t
            ],
            [
                "target", "_blank"
            ],
            ["class", "availability-ribbon__banner"]);
            f(e, i);
            var n = h("span", ["class", "availability-ribbon__text"]);
            n.textContent = a.call(this);
            f(i, n);
            var s = h("div", ["class", "availability-ribbon__power"]);
            s.textContent = "powered by Cushion";
            f(e, s);
            f(r, e)
        }
        e.render = l;
        return o(e)
    }
    function y(e) {
        var r = e.container;
        var t = e.href;
        function a() {
            switch (this.availability) {
                case i:
                    return "available";
                case s:
                    return "booked until " + this.month();
                case n:
                    return "unavailable";
                case u:
                    return "error"
            }
        }
        e.render = function() {
            if (t === undefined)
                t = this.referralUrl();
            var e = h(
                t
                ? "a"
                : "span",
            [
                "class", "availability-badge " + this.availability
            ]);
            if (t) {
                e.href = t;
                e.target = "_blank"
            }
            e.textContent = a.call(this);
            f(r, e)
        };
        return o(e)
    }
    e.custom = o;
    e.badge = y;
    e.ribbon = p;
    if (typeof window !== "undefined" && r === window) {
        document.addEventListener("DOMContentLoaded", function() {
            var e = document.querySelector("script[data-user]");
            if (!e)
                return;
            var r = e.getAttribute("data-user");
            var t = document.querySelector("[data-availability-badge]");
            if (t) {
                y({user: r, container: t})
            } else {
                p({user: r})
            }
        })
    }
    r["Availability"] = e
})({}, function() {
    return this
}());
