
# Converts MasterMap Topography Layer files (Gzipped) in the data directory into vector tiles in the tiles directory.
# Requires Gdal and Tippecanoe.
# Use Make with -j to run multiple jobs at once.

heights = data/su18nw_bldgHts.csv

tiles: $(addprefix tiles/, $(notdir $(basename $(wildcard data/*.gz))))

tiles/%: %.geo.json
	mkdir -p tiles
	tippecanoe \
		--no-feature-limit \
		--no-tile-size-limit \
		--minimum-zoom 12 \
		--maximum-zoom 16 \
		--layer $(basename $@) \
		--output-to-directory $@ \
		$<

%.geo.json: %.sqlite
	ogr2ogr \
		-f geojson \
		-select fid,versionDate,theme1,make,descriptiveGroup1,physicalLevel,abshmax,abshmin \
		$@ \
		$<

%.sqlite: %.gml
	ogr2ogr \
		-f sqlite \
		-s_srs 'EPSG:27700' \
		-t_srs 'EPSG:4326' \
		-splitlistfields \
		-nln geo \
		$@ \
		$< \
		TopographicArea
	rm $(basename $<).gfs
	ogr2ogr \
		-update \
		-f sqlite \
		-nln heights \
		$@ \
		$(heights)
	ogrinfo \
		-sql 'ALTER TABLE geo ADD COLUMN abshmin DECIMAL' \
		$@
	ogrinfo \
		-sql 'UPDATE geo SET abshmin = (SELECT CAST(heights.abshmin AS DECIMAL) FROM heights WHERE heights.toid = geo.fid)' \
		$@
	ogrinfo \
		-sql 'ALTER TABLE geo ADD COLUMN abshmax DECIMAL' \
		$@
	ogrinfo \
		-sql 'UPDATE geo SET abshmax = (SELECT CAST(heights.abshmax AS DECIMAL) FROM heights WHERE heights.toid = geo.fid)' \
		$@

%.gml: data/%.gz
	gzip \
		--decompress \
		--to-stdout \
		$< \
		> $@

tiles/%.bil: %.geo.tiff
	mkdir -p tiles
	gdal_translate \
		-of envi \
		-ot uint16 \
		-scale 80 150 0 255 \
		-outsize 501 501 \
		$< \
		$@
	rm $@.aux.xml
	rm $(basename $@).hdr

%.geo.tiff: %.asc
	gdalwarp \
		-of gtiff \
		-s_srs 'EPSG:27700' \
		-t_srs 'EPSG:4326' \
		$< \
		$@

%.asc: data/%.zip
	unzip \
		-p \
		$< \
		'*.asc' \
		> $@
