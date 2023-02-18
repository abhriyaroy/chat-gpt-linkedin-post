// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
    console.log(Deno.env.get('promptQuery'))
    console.log(Deno.env.get('linkedInUrl'))
    console.log(Deno.env.get('linkedInOAuthToken'))
    console.log(Deno.env.get('linkedInUserId'))
    var text = await getPromtText()
    console.log(text)
    var postToLinkedInResponse = await postToLinked(text)

  return new Response(
    JSON.stringify({
        gpt_response: text,
        post_to_linkedin: postToLinkedInResponse
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})

function getPromtText(): Promise<String> {
    var chatGptToken = Deno.env.get('chatGptToken');
    var openAiUrl = Deno.env.get('openAiUrl');
    var openAiOrganisation = Deno.env.get('openAiOrganisation');
    console.log(chatGptToken + ", " + openAiUrl + "," + openAiOrganisation);
    return fetch(openAiUrl , {
        "method": "POST",
        "headers" : {
            "content-type": "application/json",
            "Authorization" : "Bearer " + chatGptToken,
            "OpenAI-Organization" : openAiOrganisation
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
        prompt: Deno.env.get('promptQuery'),
        max_tokens: 500
    })
}

function postToLinked(textToPost : String) : Promise<String> {
    console.log(Deno.env.get('linkedInUrl') + ", " + "Bearer " + Deno.env.get('linkedInOAuthToken'))
    return fetch(Deno.env.get('linkedInUrl'), {
        "method": "POST",
    "headers" : {
            "content-type": "application/json",
        "Authorization" : "Bearer " + Deno.env.get('linkedInOAuthToken'),
    },
        "body" : getLinkedInPostBody(textToPost)
    })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    return res
                })
}

function getLinkedInPostBody(textToPost : String) : String {

    var a = JSON.stringify(
            {
                author: 'urn:li:person:' + Deno.env.get('linkedInUserId'),
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: "ChatGpt's advice to Android developers for today is " + textToPost + "\n #android #AndroidDev #androiddevelopers #advice #programming #chatgpt #coding"
                        },
                        shareMediaCategory: "NONE"
                    }
                },
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }
    )
    console.log(a)
    return a

}
