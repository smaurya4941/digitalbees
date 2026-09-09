<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Retention
    |--------------------------------------------------------------------------
    |
    | How many revisions to keep per content entity. Older revisions are pruned
    | after each new one is recorded. Set to 0 to disable pruning (keep all).
    |
    */

    'keep' => (int) env('CONTENT_REVISIONS_KEEP', 20),

];
