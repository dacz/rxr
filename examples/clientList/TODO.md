
## try to scope reducer (wrapping with a function)... just for now with hand-made one to test.

## blueprint example

## Simplify! Merge example with docs - more code + video


events/messages/actions => f(state) => view

messagesStreamA --- some transformations --- reducer funcs ---\
messagesStreamB --- some transformations --- reducer funcs ----\
messagesStreamC --- some transformations --- reducer funcs --------reducer funcs stream
messagesStreamD --- some transformations --- reducer funcs ----/
messagesStreamE --- some transformations --- reducer funcs ---/

^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^
what's going on     if we need to make       last transformations
within the app      some transformations     to the message stream
(events, user       to the stream            that creates function
input and more)     like convert data        how to modify state
