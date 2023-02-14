// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

import {chatGptToken, openAiOrganisation, openAiUrl, promptQuery, linkedInUrl} from './secrets.ts';

serve(async (req) => {
  const { name } = await req.json()
    var text = await getUsers()

  return new Response(
    JSON.stringify({
        gpt_response: text
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})

function getUsers(): Promise<String> {

    return fetch('$openAiUrl', {
        "method": "POST",
        "headers" : {
            "content-type": "application/json",
            "Authorization" : "Bearer $chatGptToken",
            "OpenAI-Organization" : '$openAiOrganisation'
        },
        "body" : getBodyForRequest()
    })
                .then(res => res.json())
                .then(res => {
                    return res.choices[0].text
                })
}

function getBodyForRequest() : String {
    return JSON.stringify({
        model: "text-davinci-003",
        prompt: '$promptQuery',
        max_tokens: 100
    })
}

function postToLinked() : Promise<String> {
    return fetch('$linkedInUrl', {
        "method": "POST",
    "headers" : {
            "content-type": "application/json",
        "Authorization" : "Bearer $chatGptToken",
        "OpenAI-Organization" : '$openAiOrganisation'
    },
    "body" : getBodyForRequest()
    })
                .then(res => res.json())
                .then(res => {
                    return res.choices[0].text
                })
}
