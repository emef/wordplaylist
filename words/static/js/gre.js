var console = console ? console
                      : {log : function(msg) {} };

Array.prototype.shuffle = function() {
    var s = [];
    while (this.length) s.push(this.splice(Math.random() * this.length, 1)[0]);
    while (s.length) this.push(s.pop());
    return this;
}

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

    var start_quiz = function(q_data) {
        if(!q_data) {
            alert("quiz not found, call matt");
            return;
        }

        var score = 0;
        var attempted = 0;
        var p_area = $("#play-area");

        // add playlist header
        var header = $("<h3>"+q_data.name+"</h3>");
        p_area.children().remove();
        p_area.text("");
        p_area.append(header);

        // add score div
        var score_board = $("<span />")
        header.append(score_board);

        // score fn
        var total_score = q_data.words.length;
        var update_score = function() {
            score_board.text(" CORRECT: " + score + " / " + attempted);
        }

        // initial score
        update_score();

        // question area
        var q_area = $("<div id='word-area' />");
        p_area.append(q_area);

        // get all definitions
        var definitions = [];
        for (var i=0; i<q_data.words.length; i++)
            definitions.push(q_data.words[i].definition);

        // keep track of what question we're on
        var q_index = 0;
        
        var end_question = function() {
            q_index++;
            if (q_index < q_data.words.length) {
                play_question(q_data.words[q_index]);
            } else {
                p_area.children().remove();
                p_area.append("Quiz complete, you got " + score + " out of " + attempted);
            }
        }
        
        // play question
        var play_question = function(w) {
            q_area.children().remove();
            
            var prompt = $("<div class='word'>What is the definition of </div>");
            var word = $("<span />")
            word.text(w.word);
            prompt.append(word);
            prompt.append("?");
            q_area.append(prompt);

            var answers = [w.definition];
            while(answers.length <= 4 && answers.length < definitions.length) {
                var d = definitions[Math.floor(Math.random() * definitions.length)];
                var ok = true;
                for (var i=0; i<answers.length; i++) {
                    if (d == answers[i])
                        ok = false;
                }
                if (ok) answers.push(d);
            }
            
            answers.shuffle();
            
            var on_answered = function(answer, chosen, correct) {
                if (answer == w.definition) {
                    score++;
                }
                attempted++;
                update_score();

                $(chosen).css("color", "red");
                $(correct).css("color", "green");

                var btn = $("<button>next</button>");
                btn.click(function() {
                    end_question();
                });

                q_area.append(btn);
                
            };

            var correct;
            for (var i=0; i<answers.length; i++) {
                var d = $("<div class='answer'/>");
                var r = $("<input type='radio' name='answer'/>");
                r.change((function(a, d) { 
                    return function() {
                        on_answered(a, d, correct); 
                    }
                })(answers[i], d));
                if (answers[i] == w.definition) correct = d;
                d.append(r);
                d.append(answers[i]);
                q_area.append(d);
            }
            
        }

        play_question(q_data.words[0]);
        
    }

    modal_handlers.add("login", "Login", function(content) {
    });

    modal_handlers.add("register", "Register for WordPlaylist", function(content) {
        content.append(define_form(register_form));
    });

    modal_handlers.add("add_playlist", "Add a Playlist", function(content) {
        
    });

    modal_handlers.add("add_word", "Add a Word to Selected Playlist", function(content) {
        
    });

    exports.start_quiz = function(id) {
        $.ajax({
            url: "/playlist/" + id,
            data: {},
            dataType: "json",
            success: start_quiz
        });
    };

    exports.email_signup = function() {
        var email = $("#email-signup").val();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            $("#email-list").children().remove();
            $("#email-list").text("saving...");
            $.ajax({
                type: "get",
                url: "/add-email/",
                data: {email: email},
                dataType: "json",
                success: function(r) {
                    setTimeout(function() {
                        if (r) {
                            $("#email-list").text("added to email list");
                        } else {
                            $("#email-list").text("error!");
                        }
                    }, 500);
                }
            });
        }
    }

    exports.init = function() {
        $("#email-btn").click(exports.email_signup);
    }
    
    /* exported functions */
    exports.modal = function(mode) {
        console.log(mode);
        modal_handlers[mode]();
    };
    
})(page);

$(document).ready(page.init);