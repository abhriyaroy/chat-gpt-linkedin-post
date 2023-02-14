var res = JSON.stringify({
    id: "cmpl-6ipnKf6JqHlbPXwnxzX2ZlIbUhz1b",
    object: "text_completion",
    created: 1676143550,
    model: "text-davinci-003",
    choices: [{
        text: " to take advantage of the Architecture Components that have been released by Google. These component...",
        index: 0,
        logprobs: null,
        finish_reason: "stop"
    }],
    usage: {
        prompt_tokens: 8,
        completion_tokens: 72,
        total_tokens: 80
    }
});

var jsonData = JSON.parse(res);
console.log(jsonData.choices)
