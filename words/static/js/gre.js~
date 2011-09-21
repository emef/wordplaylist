var page = {};

var register_form = {
    btn_text : "Register",
    fields : {
        email: {
            label: "Email",
            regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Please enter a valid email"
        },
        password: {
            label: "Password",
            type: "password"
        },
        repeat: {
            label: "Password Again",
            type: "password"
        }
    }
}

function define_form(obj, callback) {
    var form = $("<div class='form' />");
    var message = $("<div class='message' />");
    var submit = $("<button />");
    var fields = obj.fields;
    form.append(message);
    for (key in fields) {
        var label = fields[key].label;
        var type = fields[key].type || "text";
        var container = $("<div />");
        var textbox = $("<input name='" + key + "' type='" +type + "' />");
        container.append($("<div>" + label + "</div>"));
        container.append(textbox);
        form.append(container);
    }
    submit.text(obj.btn_text);
    submit.click(function() {
        var result = {};
        var valid = true;
        var err_msg = "";
        for (key in fields) {
            result[key] = form.find("input[name=" + key + "]").val();
            if (result[key] == "") {
                valid = false;
                err_msg = "All fields are required";
                break;
            }
            if (fields[key].regex) {
                valid = valid && fields[key].regex.test(result[key]);
                if (!valid) {
                    err_msg = fields[key].message;
                    break;
                }
            }
        }
        if (!valid) {
            message.text(err_msg);
        } else {
            fn();
        }
        return false;
    });
    form.append(submit);
    return form;
}

(function(exports) {
    var modal_handlers = {
        add: function(name, title, fn) {
            this[name] = function() {
                $("#osx-modal-title").text(title);
                var content = $("#osx-modal-data");
                content.children().remove();
                fn(content);
            };
        }
    };

    modal_handlers.add("login", "Login", function(content) {
    });

    modal_handlers.add("register", "Register for WordPlaylist", function(content) {
        content.append(define_form(register_form));
    });

    modal_handlers.add("add_playlist", "Add a Playlist", function(content) {
        
    });

    modal_handlers.add("add_word", "Add a Word to Selected Playlist", function(content) {
        
    });

    
    /* exported functions */
    exports.modal = function(mode) {
        console.log(mode);
        modal_handlers[mode]();
    };
    
})(page);