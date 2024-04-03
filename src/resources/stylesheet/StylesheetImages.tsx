{/* <div class="categories panel-body expandable" 
								ng-class="stylesheet.expanded ? 'expanded' : ''" collapse="!stylesheet.expanded">
								
								<!-- Repeat for images and fonts categories -->
								<div class="category {{category_name}}" ng-repeat="(category_name, category) in stylesheet.categories" ng-show="category.length > 0">
									<div class="sub-parent button-wrap">
										<!-- Expand button -->
										<span class="expand" 
											ng-click="category.expanded = assets.toggleBoolean(category.expanded); assets.getFontDataUris(category, resources.stylesheets.indexOf(stylesheet), category_name)" ng-class="category.expanded ? 'expanded' : ''">
											<!-- Icons -->
											<span ng-show="assets.hasAssets(category)">
												<i class="expand-icon">+</i>
												<i class="collapse-icon">-</i>
											</span>
										</span><!-- Text --><span class="text">
											{{category_name}}
										</span>
										<!-- Download Button -->
										<button class="btn btn-default" 
											ng-click="assets.downloadAllAssets(category, category_name, resources.stylesheets.indexOf(stylesheet))" 
											ng-show="assets.hasAssets(category)">
											Download {{category_name}}
										</button>
									</div>
									<!-- Progress Bar -->
									<div class="progress" ng-class="category.progressIsVisible ? '' : 'hidden'">
										<div class="progress-bar" ng-class="category.downloaded ? 'complete progress-bar-success' : 'progress-bar-striped active'" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: {{category.downloadPercent}}%">
											<span class="sr-only">{{category.downloadPercent}}% Complete (success)</span>
										</div>
									</div>
									<!-- Asset items -->
									<div class="stylesheet-item-wrap expandable" 
										ng-class="category.expanded ? 'expanded' : ''" collapse="!category.expanded">
										<div class="stylesheet-item" 
											ng-repeat="item in category">
											<div ng-show="category_name == 'images'">
												<img src="{{item.url}}">
											</div>
											<div ng-show="category_name == 'fonts'">
												<div class='font-example' ng-class="'class-' + assets.getFileName(item.url).split('.')[0]">Grumpy wizards make toxic brew for the evil Queen and Jack.</div>
												<!-- Filename text -->
											</div>
											<div class="url">
												{{assets.getFileName(item.url)}} - <a ng-click="assets.downloadSingleAssetApp(item.url, category_name); assets.preventDefaultHref($event)" title="{{item.url}}" href="{{item.url}}">Download</a>
											</div>
										</div>
									</div>
								</div>
								
							</div> */}