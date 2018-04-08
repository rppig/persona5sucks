#!/bin/sh
result='20.866'
my_best_node_delay=2000
if [ $result \< $my_best_node_delay ]
then
    echo 'success'
fi