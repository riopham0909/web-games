/**
 * Created by olga on 26.12.2023
 */

var CardBlockHandler = function () {
};

CardBlockHandler.prototype.constructor = CardBlockHandler;

CardBlockHandler.prototype.adaptCardBlocks = function (orientation, cards) {
    cards = cards || Game.currentGame.table.cards;
    this.tableRect = this.calcRect(cards);

    var cardsClusters = this.findCardsClusters(cards);
    if (cardsClusters.length < 2) {
        return;
    }

    cardsClusters.forEach(function (cluster) {
        cluster.testRect = cleverapps.clone(cluster.rect);
    });
    
    this.mergeCentreClusters(cardsClusters);
    this.applyTableRotation(cardsClusters);
    this.addPaddingToClusters(cardsClusters);

    var finalRect = cc.rect(cardsClusters[0].testRect.x, cardsClusters[0].testRect.y, 0, 0);
    cardsClusters.forEach(function (cluster) {
        finalRect = cc.rectUnion(finalRect, cluster.testRect);
    });

    if (orientation === TileTable.ORIENTATION_HORIZONTAL && finalRect.height > this.tableRect.height
        || orientation === TileTable.ORIENTATION_VERTICAL && finalRect.width > this.tableRect.width
    ) {
        return;
    }

    cardsClusters.forEach(function (cluster) {
        var offset = cc.pSub(cc.p(cluster.testRect.x, cluster.testRect.y), cc.p(cluster.rect.x, cluster.rect.y));
        cluster.cards.forEach(function (card) {
            card.x += Math.round(offset.x);
            card.y += Math.round(offset.y);
        });
    });
    return cards;
};

CardBlockHandler.prototype.mergeCentreClusters = function (cardsClusters) {
    var toMerge = [];
    var center = cc.rectGetCenter(this.tableRect);
    for (var i = 0; i < cardsClusters.length; i++) {
        var current = cardsClusters[i];
        var diffTofCenter = cc.pSub(center, cc.rectGetCenter(current.rect));
        if (!cc.rectContainsPoint(current.rect, center) && Math.abs(diffTofCenter.y) < Card.HEIGHT / 2 && Math.abs(diffTofCenter.x) < Card.WIDTH / 2 + current.rect.width / 2) {
            toMerge.push(current);
            cardsClusters.splice(i, 1);
            i--;
        }
    }
    if (toMerge.length) {
        var accumulatedCluster = toMerge.reduce(function (accumulator, currentCluster) {
            accumulator.cards = currentCluster.cards.concat(accumulator.cards);
            accumulator.rect = cc.rectUnion(accumulator.rect, currentCluster.rect);
            accumulator.testRect = cc.rectUnion(accumulator.testRect, currentCluster.testRect);
            return accumulator;
        }, { cards: [], rect: toMerge[0].rect, testRect: toMerge[0].testRect });
        cardsClusters.push(accumulatedCluster);
    }
};

CardBlockHandler.prototype.findCardsIntersections = function (cards) {
    cards = cards.slice();
    cards.sort(function (a, b) {
        return a.y - b.y;
    });
    var curIntersection = 1;
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        card.intersections = [];
        for (var j = i; j >= 0 && cards[j].y > card.y - Card.HEIGHT; --j) {
            if (card.overlaps(cards[j])) {
                card.intersections.push(...cards[j].intersections);
            }
        }
        card.i = i;
        card.intersections = cleverapps.unique(card.intersections);
        if (!card.intersections.length) {
            card.intersections.push(curIntersection);
            curIntersection++;
        }
    }
};

CardBlockHandler.prototype.findCardsClusters = function (cards) {
    cards = cards || Game.currentGame.table.cards;
    this.findCardsIntersections(cards);

    var clusteredIntersections = {};
    var curCluster = 0;
    var cardsClusters = {
    };

    for (var i = cards.length - 1; i >= 0; i--) {
        var card = cards[i];
        var found = card.intersections.find(function (intersection) {
            return clusteredIntersections[intersection];
        });
        var existCluster = clusteredIntersections[found];

        if (!existCluster) {
            curCluster++;
            cardsClusters[curCluster] = [];
            existCluster = curCluster;
        }
        cardsClusters[existCluster].push(card);

        card.intersections.forEach(function (int) {
            var cluster = clusteredIntersections[int];
            if (cluster && cluster !== existCluster) {
                cardsClusters[existCluster] = cardsClusters[existCluster].concat(cardsClusters[cluster]);
                delete cardsClusters[cluster];
                Object.keys(clusteredIntersections).forEach(function (key) {
                    if (clusteredIntersections[key] === cluster) {
                        clusteredIntersections[key] = existCluster;
                    }
                });
            }
            clusteredIntersections[int] = existCluster;
        });
    }
    return Object.keys(cardsClusters).map(function (key) {
        var rect = this.calcRect(cardsClusters[key]);
        return {
            cards: cardsClusters[key],
            rect: rect
        };
    }.bind(this));
};

CardBlockHandler.prototype.applyTableRotation = function (cardsClusters) {
    var center = cc.rectGetCenter(this.tableRect);
    var angleRadians = (Math.PI / 180) * -90;
    cardsClusters.forEach(function (cluster) {
        var rect = cluster.rect;
        var relativeX = rect.x + rect.width / 2 - center.x;
        var relativeY = rect.y + rect.height / 2 - center.y;
        var rotatedX = center.x + Math.sin(angleRadians) * relativeX - Math.cos(angleRadians) * relativeY;
        var rotatedY = center.y + Math.sin(angleRadians) * relativeX + Math.cos(angleRadians) * relativeY;

        cluster.testRect.x = rotatedX - rect.width / 2;
        cluster.testRect.y = rotatedY - rect.height / 2;
    });
};

CardBlockHandler.prototype.addPaddingToClusters = function (cardsClusters) {
    var padding = 20;
    cardsClusters = cardsClusters.sort(function (a, b) {
        return a.testRect.x - b.testRect.x;
    });

    for (var i = 0; i < cardsClusters.length; i++) {
        for (var j = i + 1; j < cardsClusters.length; j++) {
            var rect1 = cardsClusters[i].testRect;
            var rect2 = cardsClusters[j].testRect;

            if (cc.rectIntersectsRect(rect1, rect2)) {
                var overlapX = rect1.x + rect1.width + padding - rect2.x;
                rect2.x += overlapX;
            }

            if (cc.rectIntersectsRect(rect1, rect2)) {
                var overlapY = rect1.y + rect1.height + padding - rect2.y;
                rect2.y += overlapY;
            }
        }
    }
};

CardBlockHandler.prototype.calcRect = TileTable.prototype.calcRect;
CardBlockHandler.prototype.migrate = function (episodeNo, all) {
    episodeNo = episodeNo || 0;
    var episode = new Episode(episodeNo);
    var self = this;
    episode.loadData(function () {
        var content = episode.getContent();
        if (content && content.levels) {
            content = content.levels;
        }
        content.forEach(function (level) {
            (Array.isArray(level) ? level : [level]).forEach(function (levelVersions) {
                levelVersions.screens.forEach(function (screen) {
                    var cards = screen.cards.map(function (card) {
                        return new Card(card);
                    });

                    delete screen.horizontalCards;
                    if (self.adaptCardBlocks(TileTable.ORIENTATION_HORIZONTAL, cards)) {
                        screen.horizontalCards = [];
                        screen.cards.forEach(function (card, i) {
                            var horizontalCard = cleverapps.clone(card);
                            horizontalCard.x = cards[i].x;
                            horizontalCard.y = cards[i].y;
                            screen.horizontalCards.push(horizontalCard);
                        });
                    }
                });
            });
        });

        cleverapps.git.edit("episode", {
            episodeNo: episodeNo,
            content: content
        });
        if (all && bundles["episode_" + (episodeNo + 1)]) {
            self.migrate(episodeNo + 1, all);
        } else {
            cleverapps.git.push("migrate cards", cleverapps.git.listAllChanges());
        }
    });
};
