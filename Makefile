
# Converts MasterMap Topography Layer files (Gzipped) in the input directory into vector tiles in the data directory.
# Requires Gdal and Tippecanoe.
# Use Make with -j to run multiple jobs at once.

heights = input/su18nw_bldgHts.csv

data: $(addprefix data/, $(notdir $(basename $(wildcard input/*.gz))))

data/%: %.geo.json
	mkdir -p data
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

%.gml: input/%.gz
	gzip \
		--decompress \
		--to-stdout \
		$< \
		> $@
