cp build/fylke.json destinationRepo/
cp build/fylke.schema.json destinationRepo/
cp build/kommune.json destinationRepo/
cp build/kommune.schema.json destinationRepo/
tar czf $(basename $GITHUB_REPOSITORY).tar.gz -C build .