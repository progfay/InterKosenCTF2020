mkdir streams
for i in `seq 25 192`; do tshark -nr packet.pcap -qz "follow,http,ascii,${i}" > "streams/${i}.txt"; done
