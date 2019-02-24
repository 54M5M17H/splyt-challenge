# Splyt Tasks

This repo contains my solutions to the Splyt challenges.

Here you'll find my walkthrough of the process for putting this repo together, as well as instruction on how to setup and test it yourself.

## General Discussion

I chose to write this project in TypeScript because it simply makes life easy. When writing the Scheduler for example, with TypeScript I know the details of the properties & structures I'm handling as I'm typing. The project contains a `build` command to assemble the distribution, a `test` command, & a `lint` command for performing a tslint check against the source, using aribnb standards with some modifications.

Tests are written in Mocha/Should, & are available for you to run & test for yourself. I have NOT written unit tests as I usually would, because the purpose of unit tests, to check and protect the behaviour of a function/method, is not applicable to this repo which is unlikely to face continued development. Therefore ony integration tests are present, to prove the accuracy of these solutions to their tasks.

## Setup

Environment:
- Node version 8 or above

Run:
1) Clone
2) `npm i`
3) Add & modify tests as you wish
4) `npm t`

# Task 1: Default Arguments

The requirements for this are to expose a method which accepts two arguments, a function, & an object providing default values for the parameters of the function, by name. The function should return a wrapper function, which injects any provided defaults should the named argument not be provided.

The crux of this problem is that we need to identify the names of the parameters for the provided argument. A JavaScript function offers no native way for finding these, so I opted for a regex match. The pattern I used will find all parameters between the opening parentheses of a function or arrow function. Note: this match will not work with arrow functions which have no parentheses, which feels an unlikey use case given that such functions have just one parameter anyway. Once we have found these we can return a wrapper, replacing any missing arguments with provided defaults.

This module is exported as a single function for simplicity of the interface.

# Task 2: Scheduler

## Assumptions 
This implementation makes the assumption that the schedules of each individual contain sorted meetings. If this were not always the case, an implementation of a merge sort would be relatively simple given the implementation of the `isBefore` function.

## Implementation Detail
The first challenge of this task is to handle the format of the times provided. They are not Date objects, though honestly JavaScript's date implementation wouldn't help all that much. There are a couple of obvious methods that we're going to need for dealing with our String-times in the context of the scheduler: adding time & understanding the relationship between times.

To facilitate this functionality, having them as methods existing on the times themselves is easiest, & clearer than having to provide two arguments to a helper function, where the ordering of those parameters isn't self-explanatory. With this in mind I added the `addMinutes` & `isHowManyMinsBehind` methods to the global String prototype. 

*However*, doing so directly, i.e. monkey-patching, is never the correct answer, and thankfully the addition of Symbols in ES6 allows us to generate what is essentially a UUID for use as the key, with the added benefits that these `traits` added to the global prototype will not show up in any iteration of the String object, & will break no other behaviour. By exposing the symbols used, we can access these traits for the purposes of the scheduler task.

I chose to implement the algorithm within a class instance. This makes state management simpler without needing to pass it in and out of methods. It also provides the benefits of the getter/setters which are used here for "guarding" the start time property with validation.

The use of pointers for each schedule i.e. how far through an individual's calendar we have checked so far, means that we don't have to repeat work, rechecking meeting slots we've already tested.

I have tried to avoid adding comments to the scheduler code, despite its complexity.
Instead I prefer descriptive, indicative variable names.
In some case of course, even this can seem insufficient, & thus a couple of comments creep in.

## Algorithm
The body of the scheduling problem is the algorithm for determining the earliest time when all individuals have a free slot of a given length. The requirement for the meeting to be at the earliest opportunity instantly suggests that we should start at the beginning of the day and slide our potential meeting time forward until we reach a mutually available time. To begin, the earliest possible start time is the start of the work day, at 9am. 

If a human were to solve this problem manually, the method they are likely to choose is to look over one person's calendar for their first appropriate time slot. Then check the next person's calendar for the same time slot. If they can't make it, slide forward in time the start of the meeting until this person can make it. Then repeat the process for the following individuals, looping round to check that all can make the suggested timeframe. This method is exactly the implementation I chose.

Checking whether an individual is available means that their schedule meet 2 criteria: 
- the end of the meeting finished at or before the start of their next meeting: their next meeting is tracked by their `personPointer`
- the potential start time falls at or after their most recent meeting: this is the meeting prior to their next meeting

All the time it is vital to ensure the potential start time window only moves forward. I enforced this using a `setter` as mentioned above.
