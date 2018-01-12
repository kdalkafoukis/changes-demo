
# Converts MasterMap Topography Layer files (Gzipped) in the sources directory into vector tiles in the topography directory.
# Requires Gdal and Tippecanoe.
# Use Make with -j to run multiple jobs at once.

heights = sources/su18nw_bldgHts.csv

topography: $(addprefix topography/, $(notdir $(basename $(wildcard sources/*.gz))))

topography/%: %.geo.json
	mkdir -p topography
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

%.gml: sources/%.gz
	gzip \
		--decompress \
		--to-stdout \
		$< \
		> $@
