RENDERER_DIR := ../nativescript-angular
RENDERER_SRC := $(shell find "$(RENDERER_DIR)" -iname '*.ts')
RENDERER_COMPILED := node_modules/nativescript-angular-latest.txt
RENDERER_LINKED := node_modules/renderer-linked.txt
SEMVER_CLEANED := node_modules/semver-cleaned.txt
APK :=  platforms/android/build/outputs/apk/ngtests-debug.apk
APP_SRC := $(shell find "app" -type f)

$(APK): $(APP_SRC) $(RENDERER_COMPILED)
	tns build android
	@touch $@

appium-android: $(APK) $(SEMVER_CLEANED)
	./node_modules/.bin/nativescript-dev-appium android

$(RENDERER_LINKED):
	#npm link nativescript-angular
	@mkdir -p node_modules
	@touch $@

$(SEMVER_CLEANED):
	tns install
	find -L node_modules -iname '*.gz' -delete
	@touch $@

clean:
	@rm -rf node_modules platforms

$(RENDERER_COMPILED): $(RENDERER_SRC) $(RENDERER_LINKED)
	#cd "$(RENDERER_DIR)" && ./node_modules/.bin/tsc
	npm install "$(RENDERER_DIR)" --production
	@touch $@

run-android: $(RENDERER_COMPILED) $(SEMVER_CLEANED)
	tns livesync android

.PHONY: run-android clean appium-android
